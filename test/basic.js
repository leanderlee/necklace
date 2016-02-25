var assert = require("assert");
var necklace = require("../");


describe("simple tests", function () {

  it("can run basic process", function (done) {
    necklace.define("echo", function (input, next) {
      next(null, input);
    })
    necklace.run("echo", "Hello World!", function (err, result) {
      assert.equal(result, "Hello World!");
      done();
    });
  });

  it("can run ordered process", function (done) {
    necklace.define("word", function (input, next) {
      next(null, input.split(/\s+/));
    })
    necklace.define("reverse", function (input, next) {
      next(null, input.reverse());
    })
    necklace.define("join", function (input, next) {
      next(null, input.join(' '));
    })
    necklace.run(["word", "reverse", "join"], "dog lazy the over jumps fox brown quick The", function (err, result) {
      assert.equal(result, "The quick brown fox jumps over the lazy dog");
      done();
    });
  });

  it("can run each process", function (done) {
    var words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
    necklace.define("capitalize", function (input, next) {
      next(null, input.toUpperCase());
    })
    necklace.define("join", function (input, next) {
      next(null, input.join(' '));
    })
    necklace.run([{ type: "map", fn: "capitalize" }, "join"], words, function (err, result) {
      assert.equal(result, "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG");
      done();
    });
  });

})