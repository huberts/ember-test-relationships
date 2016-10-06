export default function() {

  this.post("/motions", function(db, request) {
    console.log(request);
    let attrs = this.normalizedRequestAttrs();
    let json = JSON.parse(request.requestBody);

    var motion = db.motions.create(attrs);

    json.data.relationships["selected-generators"].data.forEach((selectedGenerator) => {
      let attributes = selectedGenerator.attributes;
      attributes.generatorId = selectedGenerator.relationships.generator.data.id;
      motion.createSelectedGenerator(attributes);
    });
    return motion;
  });

  this.get("/authors/:id");
  this.get("/generators");
  this.get("/selected-generators/:id");
}
