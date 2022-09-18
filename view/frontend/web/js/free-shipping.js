define(
    [
        'uiComponent',
        'Magento_Customer/js/customer-data',
        'underscore',
        'knockout',
    ],

    function (Component, customerData, _ , ko ) {

        'use strict';

        return Component.extend({

            defaults: {
                freeShippingMax : 100,
                message: '${ $.messageDefault }',
                subtotal: 0.00,
                template: 'Pixel_FreeShipping/free-shipping',
                tracks: {
                    message:true,
                    subtotal: true
                }
            },

            initialize: function () {
                this._super();
                let self = this;
                let cart = customerData.get('cart');

                customerData.getInitCustomerData().done(function () {
                    if (!_.isEmpty(cart())) {
                        self.subtotal = parseFloat(cart().subtotalAmount);
                    }

                })
                cart.subscribe(function (cart){
                    if (!_.isEmpty(cart)) {
                        self.subtotal = parseFloat(cart.subtotalAmount);
                    }
                });

                self.message = ko.computed(function(){

                    if (_.isUndefined(self.subtotal) || self.subtotal === 0 ){
                        return self.messageDefault;
                    }

                    if (self.subtotal > 0 && self.subtotal < 100 ){
                        let subtotalRemaining = self.freeShippingMax - self.subtotal,
                            formatedSubtotalRemaining = self.formatCurrency(subtotalRemaining);

                        return self.messageItemsInCart.replace('$00.00' , formatedSubtotalRemaining);
                    }

                    if (self.subtotal >= 100){
                        return self.messageFreeShipping;
                    }
                });

            },
            formatCurrency: function (value) {
                return '$' + value.toFixed(2);
            },

        });
    })
