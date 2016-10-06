import Ember from 'ember';

export default Ember.Route.extend({
  model() {

    return this.get("store").findRecord("author", 1).then( (author) => {
      return this.get("store").findAll("generator").then( (generators) => {
        var selectedGenerator1 = this.get("store").createRecord("selectedGenerator", {buffer: 10, generator: generators.get("firstObject")});
        var selectedGenerator2 = this.get("store").createRecord("selectedGenerator", {buffer: 20, generator: generators.get("firstObject")});
        var selectedGenerator3 = this.get("store").createRecord("selectedGenerator", {buffer: 30, generator: generators.get("lastObject")});
        var selectedGenerator4 = this.get("store").createRecord("selectedGenerator", {buffer: 40, generator: generators.get("lastObject")});
        var selectedGenerator5 = this.get("store").createRecord("selectedGenerator", {buffer: 50, generator: generators.get("lastObject")});
        return this.get("store").createRecord(
          "motion",
          {
            title: "First ever created motion",
            author: author,
            selectedGenerators: [
              selectedGenerator1,
              selectedGenerator2,
              selectedGenerator3,
              selectedGenerator4,
              selectedGenerator5
            ]
          }
        );
      });
    });
  },

  actions: {
    submit(model) {
      console.log("submit time");
      model.save();
    }
  }

});
