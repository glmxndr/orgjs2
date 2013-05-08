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

    it 'should treat correctly an entity in the text', ->
      txtInit = "Starting \\alpha; the text."
      txt = Entity.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Starting TKN:[^;]+?;; the text./