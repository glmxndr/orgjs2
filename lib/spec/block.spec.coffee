require 'jasmine-matchers'
_U     = require '../src/utils'
_      = _U._
Org    = require '../src/core'
Config = require '../src/config'
Block  = require '../src/block'

describe 'Block', ->
  it 'should be defined', ->
    expect(Block).toBeDefined
    expect(Block).not.toBeNull




