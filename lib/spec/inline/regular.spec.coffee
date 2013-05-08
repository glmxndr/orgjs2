require 'jasmine-matchers'

Inline   = require '../../src/inline'
Regular  = require '../../src/inline/regular'

describe 'Regular', ->

  describe 'Regular.replace', ->

    it 'should treat correctly a regular starting the text', ->
      txtInit = "Regular TKN:1;"
      parent = new Inline()
      tokens = {'TKN:1;':{}}
      txt = Regular.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:[^;]+?;TKN:1;/

    it 'should treat correctly a regular ending the text', ->
      txtInit = "TKN:1; regular."
      parent = new Inline()
      tokens = {'TKN:1;':{}}
      txt = Regular.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:1;TKN:[^;]+?;/

    it 'should treat correctly two regulars around tokens', ->
      txtInit = "TKN:1; regular TKN:1;"
      parent = new Inline()
      tokens = {'TKN:1;':{}}
      txt = Regular.replace(txtInit, parent, 'TKN', tokens)
      expect(txt).toMatch /TKN:1;TKN:[^;]+?;TKN:1;/
