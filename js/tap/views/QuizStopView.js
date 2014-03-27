/*
 * Backbone View for displaying a Quiz Stop
 */
TapAPI.classes.views.QuizStopView = TapAPI.classes.views.BaseView.extend({
    id: 'quiz-stop',
    template: TapAPI.templateManager.get('quiz'),
    events: {
        'submit form': 'checkAnswer'
    },
    initialize: function(options) {
        this._super(options);
    },
    // Render from the template
    render: function() {
        var question = this.model.getAssetsByUsage('body');
        var choiceAssets = this.model.getAssetsByUsage('quiz_choices');
        var answer = this.model.getAssetsByUsage('quiz_answer');

        if (!_.isEmpty(choiceAssets)) {
            var choice = choiceAssets[0].get('content');
            var numChoices = choice.length;
            var choices = {};
            for (var i=0;i < numChoices; i++) {
                choices[i] = {
                    value: i+1,
                    text: choiceAssets[0].get('content').at(i).get('data')
                }
            }
        }
        this.$el.html(this.template({
            title: this.model.get('title'),
            question: question[0].get('content').at(0).get('data'),
            choices: choices,
            answer: answer[0].get('content').at(0).get('data'),
            nextStopPath: this.getNextStopPath()
        }));
        return this;
    },
    checkAnswer: function(e) {
        e.preventDefault();
        var selectedAnswer = $('input:radio[name=radio-choice]:checked').val();
        var answer = $('input:hidden[name=answer]').val();
        if (selectedAnswer) {
            if(selectedAnswer == answer) {
                console.log('Correct');
                $('.quiz-wrong').addClass('quiz-result');
                $('.quiz-correct').removeClass('quiz-result');
            } else {
                console.log('Wrong');
                $('.quiz-correct').addClass('quiz-result');
                $('.quiz-wrong').removeClass('quiz-result');
            }
        } else {
            console.log('nothing selected');
        }
    }
});