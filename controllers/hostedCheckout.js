const express = require('express');
const gatewayService = require('../service/gatewayService');
const router = express.Router();
const utils = require('../scripts/util/commonUtils');
const view_path = '../templates';
const config = require('../scripts/config/config');
/**
* Display page for Hosted Checkout operation
*
* @return response for hostedCheckout.ejs
*/
router.get('/hostedCheckout', function (request, response, next) {
    const orderId = utils.keyGen(10);
    const requestData = {
        apiOperation: "CREATE_CHECKOUT_SESSION",
        interaction: {
            operation:config.TEST_GATEWAY.OPERATION
        },
        order: {
            id: orderId,
            currency: utils.getCurrency()
        }
    }
    const apiRequest = { orderId: orderId };
    gatewayService.getSession(requestData, function (result) {
        response.render(view_path + '/hostedCheckout', {
            baseUrl: config.TEST_GATEWAY.BASEURL,
            apiVersion: config.TEST_GATEWAY.API_VERSION,
            orderId: orderId,
            merchant: result.merchant,
            result: result.result,
            session: {
                id: result.session.id,
                updateStatus: result.session.updateStatus,
                version: result.session.version
            },
            successIndicator: result.successIndicator,
            returnUrl: '/process/hostedCheckout/'
        });
        next();
    });
});
router.get('/hostedCheckout/:orderId/:successIndicator/:sessionId', function (request, response, next) {
    const sessionIndicator = request.params.successIndicator;
    const orderId = request.params.orderId;
    const sessionId = request.params.sessionId;
    const resdata = {
        "orderId": orderId,
        "sessionId": sessionId,
        "baseUrl": config.TEST_GATEWAY.BASEURL,
        "apiVersion": config.TEST_GATEWAY.API_VERSION,
        "merchant": '',
        "result": '',
        "session": {
            "id": sessionId,
            "updateStatus": '',
            "version": ''
        },
        "successIndicator": sessionIndicator,
        "returnUrl": '/process/hostedCheckout/'
    };
    response.render(view_path + '/hostedCheckout', resdata);
});
/**
* This method receives the callback from the Hosted Checkout redirect. It looks up the order using the RETRIEVE_ORDER operation and
* displays either the receipt or an error page.
*
* @param orderId needed to retrieve order
* @param result of Hosted Checkout operation (success or error) - sent from hostedCheckout.ejs complete() callback
* @return for hostedCheckoutReceipt page or error page
*/
router.get('/hostedCheckout/:orderId/:result', function (request, response, next) {
    const result = request.params.result;
    const orderId = request.params.orderId;
    if (result == "SUCCESS") {
        const apiRequest = { orderId: orderId };
        const requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
        gatewayService.paymentResult(requestUrl, function (error, result) {
            if (error) {
                const reserror = {
                    error: true,
                    title: "hostedCheckoutReceipt",
                    cause: "Payment was unsuccessful",
                    explanation: "There was a problem completing your transaction.",
                    field: null,
                    validationType: null
                }
                response.render(view_path + '/error', reserror);
            } else {
                const ressuccess = {
                    error: false,
                    cause: "Payment was successful",
                    message: "Your transaction was successfully completed",
                    resbody: JSON.parse(result)
                }
                response.render(view_path + '/hostedCheckoutReceipt', { title: "hostedCheckoutReceipt", resbody: ressuccess });
            }
        });
    } else {
        const reserror = {
            error: true,
            title: "hostedCheckoutReceipt",
            cause: "Payment was unsuccessful",
            explanation: "There was a problem completing your transaction.",
            field: null,
            validationType: null
        }
        response.render(view_path + '/error', reserror);
        next();
    }
});
module.exports = router;