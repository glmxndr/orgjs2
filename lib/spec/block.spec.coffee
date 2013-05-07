require 'jasmine-matchers'
_      = require 'lodash'

Org    = require '../src/core'
Config = require '../src/config'
Block  = require '../src/block'

describe 'Block', ->
  it 'should be defined', ->
    expect(Block).toBeDefined
    expect(Block).not.toBeNull

describe 'Block.levels', ->
  it 'should contain 5 levels', ->
    expect(Block.levels.length).toBe 5

describe 'Block.precedence', ->
  it 'should have one array per level', ->
    _.each Block.level, (lvl) ->
      expect(Block.precedence[lvl]).toBeArray

describe 'Block.register', ->

  it 'should work when called once', ->
    lvl = Block.levels[2]
    tmp = Block.precedence[lvl]
    expect(tmp.length > 0).toBe true


