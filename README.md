# Necklace: Easy Pipelines for JavaScript

Example 1
```js
necklace.define("echo", function (input, next) {
  next(null, input);
})
necklace.run("echo", "Hello World!")
```

Example 2
```js
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
```
