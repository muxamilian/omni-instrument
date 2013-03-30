$(function() {
  // Initialization
  $('#from').val('' + window.getStartFrq());
  $('#to').val('' + window.getEndFrq());

  $('#wave-type-form option[value="'+ window.getSoundType() +'"]').attr('selected', 'selected');

  $('#frequency-form').submit(UI.submitFrequencyForm);
  $('#wave-type-form').submit(UI.submitWaveTypeForm);
});

var UI = {

  submitFrequencyForm: function() {
    return false;
  },

  submitWaveTypeForm: function() {
    return false;
  }

}