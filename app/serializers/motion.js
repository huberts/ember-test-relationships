import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    selectedGenerators: {serialize: true}
  },


  serializeRelationship(snapshot, data, rel) {

    const relKind = rel.kind;
    const relKey = rel.key;

    if (this.get(`attrs.${relKey}.serialize`) === true) {

      data.relationships = data.relationships || {};
      const key = this.keyForRelationship(relKey, relKind, 'serialize');
      data.relationships[key] = data.relationships[key] || {};

      if (relKind === "belongsTo") {
        data.relationships[key].data = this.serializeRecord(snapshot.belongsTo(relKey));
      }

      if (relKind === "hasMany") {
        data.relationships[key].data = snapshot.hasMany(relKey).map(this.serializeRecord);
      }

    }

  },

  serializeRecord(obj) {

    if (!obj) {
      return null;
    }

    const serialized = obj.serialize();

    if (obj.id) {
      serialized.data.id = obj.id;
    } else {
      if (!serialized.data.attributes)
      {
        serialized.data.attributes = {};
      }
    }

    return serialized.data;

  },

  serializeHasMany() {
    this._super(...arguments);
    this.serializeRelationship(...arguments);
  },

  serializeBelongsTo() {
    this._super(...arguments);
    this.serializeRelationship(...arguments);
  },

  normalizeSaveResponse(store, modelName, obj) {

    const rels = obj.data.relationships || [];

    Object.keys(rels).forEach(rel => {
      let relationshipData = rels[rel].data;

      if (Array.isArray(relationshipData)) {
        if (relationshipData.length) {
          this.deleteNull(store, relationshipData[0].type);
        }
      } else {
        this.deleteNull(store, relationshipData.type);
      }
    });

    return this._super(store, modelName, obj);
  },

  deleteNull(store, model) {
    store.peekAll(Ember.String.singularize(model))
      .filterBy('currentState.stateName', "root.loaded.created.uncommitted")
      .map(record => record.deleteRecord());
  }
});
