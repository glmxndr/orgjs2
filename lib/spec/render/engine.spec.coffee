require 'jasmine-matchers'
RenderEngine  = require '../../src/render/engine'

describe 'RenderEngine', ->

  describe 'RenderEngine.transformPath', ->

    it 'should replace unaliased node types', ->
      orgpath = 'para..fnref'
      re = new RenderEngine()
      path = re.transformPath orgpath
      expect(path).toEqual '$..*[?(@.type && @.type.match(/para/))]..*[?(@.type && @.type.match(/fnref/))]'

    it 'should replace aliased node types', ->
      orgpath = 'p..b[1]'
      re = new RenderEngine
      path = re.transformPath orgpath
      expect(path).toEqual '$..*[?(@.type && @.type.match(/para/))]..*[?(@.type && @.type.match(/strong/))][1]'