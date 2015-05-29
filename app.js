var Todo = Backbone.Model.extend({
  defaults: {
    text: '',
    complete: false
  },

  toggleCheck: function() {
    this.set('complete', !this.get('complete'));
    console.log('complete is set to: ' + this.get('complete'));
  },

  delete: function() {
    // debugger;
    this.trigger('delete', this);
  }

});

var List = Backbone.Collection.extend({
  model: Todo,

  initialize: function(){
    this.on('delete', function(todo) {
      this.remove(todo);
    }, this);
  }

});

var TodoView = Backbone.View.extend({

  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  tagName: 'li',

  template: _.template('<span class="todo"><input type="checkbox"><%- text %></span><button class"delete"></button>'),

  render: function() {
    // var className = '';
    // if this.model.get('complete')
    if (this.model.get('complete')) {
      this.$el.html(this.template(this.model.attributes)).addClass('done');
      this.$el.find('input').attr('checked', 'true');
      return this.$el;
    } else {
      this.$el.html(this.template(this.model.attributes)).removeClass('done');
      return this.$el;
    }
  },

  events: {
    'change input': 'handleCheck',
    'click button': function() {
      this.model.delete();
    }
  },

  handleCheck: function() {
    console.log('check clicked!');
    this.model.toggleCheck();
  }

});

var ListView = Backbone.View.extend({

  el: '#todo-list',

  initialize: function() {
    this.collection.on('add remove', this.render, this);
    this.onscreenTodos = {};
  },

  render: function() {
    this.$el.empty();
    var template = this.collection.forEach(function(todo) {
      this.$el.prepend(new TodoView({model: todo}).render());
    }, this);
    this.$el.html(template);
  },

  renderTodo: function(todo) {
    // if (!this.onscreenTodos[todo.get('cid')]) {
    // var todoView = new TodoView({model: todo});
    // this.$el.html(todoView.render());
    //   this.onscreenTodos[todo.get('cid')] = true;
    // }
  }

});

var FormView = Backbone.View.extend({

  el: $('#input'),

  events: {
    'submit': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var $text = this.$('#text');
    this.collection.add({
      text: $text.val(),
    });
    $text.val('');
  }
});


