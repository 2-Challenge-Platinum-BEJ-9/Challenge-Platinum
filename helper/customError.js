class MyCustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "MyCustomError";
    // kasi status
  }
}

module.exports = { MyCustomError };
