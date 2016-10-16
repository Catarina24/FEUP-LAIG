var Structure = {
  stack: function() {
    var elements;

    this.push = function(element) {
      if (typeof(elements) === 'undefined') {
        elements = [];
      }
      elements.push(element);
    }

    this.pop = function() {
      return elements.pop();
    }

    this.top = function() {
      return elements[elements.length - 1];
    }
  }
}
