;(function($, window, document, undefined){
"use strict";


$(function(){
  
  var view = new View({
    el: "#dad",
    collection: {
      category: new Category_Collection([{
        id: "1",
        name: "カテゴリ１"
      }, {
        id: "2",
        name: "カテゴリ２"
      }]),
      tag: new Tag_Collection([{
        name: "はげ１",
        star: false,
        category: "null"
      }, {
        name: "はげ２",
        star: false,
        category: "null"
      }, {
        name: "はげ３",
        star: false,
        category: "null"
      }, {
        name: "はげ４",
        star: false,
        category: "null"
      }, {
        name: "ほげ１",
        star: true,
        category: "1"
      }, {
        name: "ほげ２",
        star: false,
        category: "1"
      }, {
        name: "ほげ３",
        star: false,
        category: "1"
      }, {
        name: "ほげ４",
        star: false,
        category: "1"
      }, {
        name: "ふが１",
        star: true,
        category: "2"
      }, {
        name: "ふが２",
        star: false,
        category: "2"
      }, {
        name: "ふが３",
        star: false,
        category: "2"
      }, {
        name: "ふが４",
        star: false,
        category: "2"
      }])
    }
  });
  
});



/*
## Category
*/

var Category_Model = Backbone.Model.extend({
  
  defaults: function(){
    return {
      name: ""
    }
  },
  
  initialize: function(){
    //_.bindAll(this, "");
    
  }
  
});


var Category_Collection = Backbone.Collection.extend({
  
  model: Category_Model
  
});



/*
## Tag
*/

var Tag_Model = Backbone.Model.extend({
  
  defaults: function(){
    return {
      name: "",
      star: false,
      category: "",
      klass: "dad_tag_1 is_star"
    }
  },
  
  initialize: function(){
    _.bindAll(this, "reset_klass");
    this.reset_klass();
    this.on("change:star", this.reset_klass);
    this.on("change:category", this.reset_klass);
  },
  
  reset_klass: function(){
    var klass = "dad_tag_1",
        category = this.get("category"),
        star = this.get("star");
    if( "null" != category ){
      klass += " is_star";
    }
    if( star ){
      klass += " is_on";
    }
    this.set("klass", klass);
  }
  
});


var Tag_Collection = Backbone.Collection.extend({
  
  model: Tag_Model
  
});



/*
## View
*/

var View = Backbone.View.extend({
  
  initialize: function(){
    var self = this;
    _.bindAll(this, "render", "drop");
    console.log("View");
    
    console.log("collection", this.collection);
    //console.log("category", this.collection.category);
    //console.log("tag", this.collection.tag);
    
    this.$categories = $("#dad_categories");
    
    this.$template = {
      category_1: _.template($("#template_dad_category_1").html()),
      tag_1: _.template($("#template_dad_tag_1").html())
    };
    
    this.$category = {};
    
    var categories_html = _.map(this.collection.category.toJSON(), function(data){
      var html = self.$template.category_1(data);
      //console.log("data", data);
      //console.log("html", html);
      return html;
    }).join("");
    this.$categories.prepend(categories_html);
    
    var category = this.collection.category.pluck("id");
    category = _.uniq(category);
    category.unshift("null");
    console.log("category", category);
    _.each(category, function(_cat){
      self.$category[_cat] = $("#category__" + _cat);
    });
    console.log( this.$category );
    
    this.$dad_category_1 = $(".dad_category_1");
    this.$dad_category_1.accordion({
      header: ".dad_category_1__name",
      collapsible: true,
      active: false,
      animate: 400
    });
    
    this.render();
    
    $(".js_category_1").droppable({
      drop: this.drop
    });
    
    this.collection.tag.on("change", this.render);
  },
  
  drop: function(e, ui) {
    console.group("drop");
    console.log(e, ui);
    console.log(e.target);
    console.groupEnd();
    var $me = $(e.target),
        $draggable = $(ui.draggable),
        category = $me.attr("data-category"),
        $items = $me.find(".dad_category_1__items");
    console.group("ドロップされました");
    console.log("category", category);
    
    var name = $draggable.text(),
        model = this.collection.tag.findWhere({"name": name});
    console.log("name", name);
    console.log("model", model);
    model.set("category", category);
    
    console.log(e);
    console.log(ui);
    //console.log(this);
    //console.log($draggable);
    //$items.append($draggable);
    console.groupEnd();
  },
  
  render: function(){
    var self = this;
    console.group("render");
    _.each(this.$category, function(_$cat){
      _$cat.empty();
    });
    
    this.collection.tag.each(function(model){
      var category = model.get("category");
      var html = self.$template.tag_1(model.toJSON());
      self.$category[category].append(html);
    });
    
    this.$dad_category_1.accordion("refresh");
    
    $(".dad_tag_1").draggable({
      revert: true,
      revertDuration: 0
    });
    
    console.groupEnd();
  }
  
});



})(jQuery, this, this.document);