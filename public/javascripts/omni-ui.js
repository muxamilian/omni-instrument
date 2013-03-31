$(function() {
  // Initialization
  $('#from').val('' + window.getStartFrq());
  $('#to').val('' + window.getEndFrq());

  $('#wave-type-form option[value="'+ window.getSoundType() +'"]').attr('selected', 'selected');

  $('#from').change(UI.changedFrom);
  $('#to').change(UI.changedTo);
  $('#wave-type').change(UI.changedWaveType);
});

var UI = {

  DURATION: 300,

  maxFrq: 20000,

  minFrq: 10,

  showError: function(text) {
    $('#errors').html(text).show(UI.DURATION);
  },

  hideError: function() {
    $('#errors').hide(UI.DURATION);
    $('#options-modal input').each(function() {
      $(this).parent().removeClass('error');
    });
  },

  changedFrom: function() {
    var from = $('#from');
    var fromVal = parseFloat(from.val());
    var to = $('#to');
    var toVal = parseFloat(to.val());

    if (isNaN(fromVal)) {
      UI.showError("You didn't enter a valid number in 'from'.");
      from.parent().addClass('error');
    } else if (fromVal < UI.minFrq) {
      UI.showError("The value you entered in 'from' must not be smaller than " + UI.minFrq + ".");
      from.parent().addClass('error');
    } else if (toVal - fromVal <= 0) {
      UI.showError("'from' must not be larger or equal to 'to'.");
      from.parent().addClass('error');
    } else {
      window.setStartFrq(fromVal);
      UI.hideError();
    }
    return false;
  },

  changedTo: function() {
    var from = $('#from');
    var fromVal = parseFloat(from.val());
    var to = $('#to');
    var toVal = parseFloat(to.val());

    if (isNaN(toVal)) {
      UI.showError("You didn't enter a valid number in 'to'.");
      to.parent().addClass('error');
    } else if (toVal > UI.maxFrq) {
      UI.showError("The value you entered in 'to' must not be larger than " + UI.maxFrq + ".");
      to.parent().addClass('error');
    } else if (toVal - fromVal <= 0) {
      UI.showError("'from' must not be larger or equal to 'to'.");
      to.parent().addClass('error');
    } else {
      window.setEndFrq(toVal);
      UI.hideError();
    }
    return false;
  },

  changedWaveType: function() {
    window.setSoundType(parseInt($('#wave-type').val()));

    return false;
  }

}
