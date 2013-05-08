require 'jasmine-matchers'

Inline = require '../../src/inline'
Link   = require '../../src/inline/link'

describe 'Link', ->

  describe 'Link.replace', ->
    parent = 0
    tokens = 0

    beforeEach ->
      parent = new Inline()
      tokens = {}

    it 'should treat correctly a bare link starting the text', ->
      txtInit = "http://hegemonikon.org#test starting the text."
      txt = Link.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:[^;]+?; starting the text./

    it 'should treat correctly a simple link starting the text', ->
      txtInit = "[[http://hegemonikon.org#test]] starting the text."
      txt = Link.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:[^;]+?; starting the text./

    it 'should treat correctly a full link starting the text', ->
      txtInit = "[[http://hegemonikon.org#test][The *hegemonikon* website]] starting the text."
      txt = Link.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:[^;]+?; starting the text./

    it 'should treat correctly two links in the same text', ->
      txtInit = "[[http://hegemonikon.org]] should be the same as http://hegemonikon.org/"
      txt = Link.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:[^;]+?; should be the same as TKN:[^;]+?;/
