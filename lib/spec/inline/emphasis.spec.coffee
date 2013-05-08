require 'jasmine-matchers'

Inline   = require '../../src/inline'
Emphasis = require '../../src/inline/emphasis'

describe 'Emphasis', ->

  describe 'Emphasis.replace', ->
    parent = 0
    tokens = 0

    beforeEach ->
      parent = new Inline()
      tokens = {}

    it 'should treat correctly an emphasis starting the text', ->
      txtInit = "/Starting/ the text."
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:[^;]+?; the text./

    it 'should treat correctly an emphasis ending the text', ->
      txtInit = "Ending the /text./"
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Ending the TKN:[^;]+?;/

    it 'should treat correctly two emphasis in the same text', ->
      txtInit = "Then /starting/ the text. Ending the /text./"
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Then TKN:[^;]+?; the text. Ending the TKN:[^;]+?;/

    it 'should treat correctly two emphasis nested in the same text', ->
      txtInit = "Some /emphasis /nested/ in the/ text."
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Some TKN:[^;]+?; text./

    it 'should treat correctly an emphasis containing its own escaped trigger character', ->
      txtInit = "Some /em\\/is/ text."
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Some TKN:[^;]+?; text./

    it 'should treat correctly an emphasis containing only one character', ->
      txtInit = "Some /1/ text."
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Some TKN:[^;]+?; text./

    it 'should treat correctly an emphasis with new line in it', ->
      txtInit = "Some /new\nline/ text."
      txt = Emphasis.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /Some TKN:[^;]+?; text./    