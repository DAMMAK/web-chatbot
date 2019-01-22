(function() {
    var Message;
    var accessToken = "9e78a546742344f381325e76f9c8742d";
    var baseUrl = "https://api.dialogflow.com/v1/";
    Message = function(arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function(_this) {
            return function() {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function() {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function() {
        var getMessageText, message_side, sendMessage;
        var fetch_msg_ai;
        message_side = 'right';
        getMessageText = function() {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };


        fetch_msg_ai = async function(txtMsg) {
            $.ajax({
                type: "POST",
                url: baseUrl + "query?v=20150910",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                data: JSON.stringify({
                    query: txtMsg,
                    lang: "en",
                    sessionId: "somerandomthing"
                }),
                success: function(data) {
                    var respText = data.result.fulfillment.speech;
                    console.log("Respuesta: " + respText);
                    sendMessage(respText);
                    return respText;
                },
                error: function() {
                    let error = "Error Connecting to our customer service";
                    sendMessage(error);
                    return (error);
                }
            });
        }


        sendMessage = async function(text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function(e) {
            sendMessage(getMessageText());
        });
        $('.message_input').keyup(async function(e) {
            if (e.which === 13) {
                let msgNew = getMessageText();
                if (sendMessage(msgNew)) {
                    let return_msg = await fetch_msg_ai(msgNew);
                    if (return_msg != null) sendMessage(return_msg);
                }
            }
        });
        // sendMessage('Hello Philip! :)');
        // setTimeout(function() {
        //     return sendMessage('Hi Sandy! How are you?');
        // }, 1000);
        // return setTimeout(function() {
        //     return sendMessage('I\'m fine, thank you!');
        // }, 2000);
    });
}.call(this));