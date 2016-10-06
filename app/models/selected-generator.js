import DS from 'ember-data';

export default DS.Model.extend({
  buffer: DS.attr("number"),
  generator: DS.belongsTo()
});
