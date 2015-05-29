var Todo = Backbone.Model.extend({
  defaults: {
    text: '',
    complete: false,
    priority: 0
  },

  toggleCheck: function() {
    this.set('complete', !this.get('complete'));
    console.log('complete is set to: ' + this.get('complete'));
  },

  delete: function() {
    // debugger;
    this.trigger('delete', this);
  },

  increasePriority: function(){
    this.set('priority', this.get('priority') + 1);
    this.trigger('prioritySort', this);
  },

  decreasePriority: function(){
    this.set('priority', this.get('priority') - 1);
    this.trigger('prioritySort', this);
  }

});

var List = Backbone.Collection.extend({
  model: Todo,

  comparator: 'priority',

  initialize: function(){

    this.on('delete', function(todo) {
      this.remove(todo);
    }, this);

    if (JSON.parse(localStorage.getItem('todoLocal'))) {
      this.add(JSON.parse(localStorage.getItem('todoLocal')));
    }

    this.on('add remove prioritySort', function() {
      this.sort();
      localStorage.setItem('todoLocal', JSON.stringify(this));
    });

    // this.on('prioritySort', function(){
    //   console.log('prioritySort!');

    // });
  },




});

var TodoView = Backbone.View.extend({

  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  tagName: 'li',

  template: _.template('<span class="todo"> \
                          <input type="checkbox"><%- text %> \
                        </span> \
                        <span class="priority"><%- priority %></span> \
                        <button class="plus">+</button> \
                        <button class="minus">-</button> \
                        <button class="delete">trashcan</button>'),

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
    'click .delete': function() {
      this.model.delete();
    },
    'click .plus': function(){
      this.model.increasePriority();
    },
    'click .minus': function(){
      this.model.decreasePriority();
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
    this.render();
    this.collection.on('add remove prioritySort', this.render, this);
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
