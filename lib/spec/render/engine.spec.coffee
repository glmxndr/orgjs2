require 'jasmine-matchers'
RenderEngine  = require '../../src/render/engine'

describe 'RenderEngine', ->

  it 'should be defined', ->
    expect(RenderEngine).not.toBeUndefined