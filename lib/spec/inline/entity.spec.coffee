require 'jasmine-matchers'

Inline = require '../../src/inline'
Entity = require '../../src/inline/entity'

describe 'Entity', ->

  describe 'Entity.replace', ->
    parent = 0
    tokens = 0

    beforeEach ->
      parent = new Inline()
      tokens = {}

    it 'works with entities with capitals', ->
      txtInit = "Starting \\Agrave; the text."
      txt = Entity.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Starting TKN:[^;]+?;; the text./

    it 'works with entities ending with numbers', ->
      txtInit = "Starting \\frac12; the text."
      txt = Entity.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Starting TKN:[^;]+?;; the text./

    it 'should treat correctly an entity in the text', ->
      txtInit = "Starting \\alpha; the text."
      txt = Entity.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Starting TKN:[^;]+?;; the text./

    it 'suppresses the unescaped space following the entity', ->
      txtInit = "Starting \\alpha the text."
      txt = Entity.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Starting TKN:[^;]+?;the text./

    it 'keeps the escaped space following the entity', ->
      txtInit = "Starting \\alpha\\ the text."
      txt = Entity.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Starting TKN:[^;]+?; the text./
    
