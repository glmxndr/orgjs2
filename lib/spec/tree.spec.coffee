require('jasmine-matchers')
_U    = require '../src/utils.js'
_U.id = _U.incrementor()
_     = require 'lodash'
ids   = (arr) -> _.pluck(arr, 'id')

TreeNode = require '../src/tree.js'


describe 'TreeNode', ->
  it 'should be defined', ->
    expect(TreeNode).not.toBeUndefined()
    expect(TreeNode).not.toBeNull()

  # Fixtures
  root = new TreeNode(null)
  n1  = new TreeNode(null, root)
  n2  = new TreeNode(null, root)
  n21 = new TreeNode(null, n2) 
  n2.append(n21)
  n22 = new TreeNode(null, n2) 
  n2.append(n22)
  n23 = new TreeNode(null, n2) 
  n2.append(n23)
  n24 = new TreeNode(null, n2) 
  n2.append(n24)
  n25 = new TreeNode(null, n2) 
  n2.append(n25)

  describe 'TreeNode.ancestors', ->
    it 'should provide ancestors in document order', ->
      expect(ids n22.ancestors()).toHavePropertiesWithValues([3, 1])

  describe 'TreeNode.children', ->
    it 'should provide all children in document order', ->
      expect(ids n2.children()).toHavePropertiesWithValues([4, 5, 6, 7, 8])

  describe 'TreeNode.prevAll', ->
    it 'should provide all previous siblings in document order', ->
      expect(ids n22.ancestors()).toHavePropertiesWithValues([3, 1])

  describe 'TreeNode.prev', ->
    it 'should provide only the previous sibling', ->
      expect(n23.prev().id).toBe(5)

  describe 'TreeNode.nextAll', ->
    it 'should provide all next siblings in document order', ->
      expect(ids n23.nextAll()).toHavePropertiesWithValues([7, 8])

  describe 'TreeNode.next', ->
    it 'should provide only the next sibling', ->
      expect(n23.next().id).toBe(7)

  describe 'TreeNode.siblingsAll', ->
    it 'should provide all siblings in document order, with the current node', ->
      expect(ids n23.siblingsAll()).toHavePropertiesWithValues([4, 5, 6, 7, 8])

  describe 'TreeNode.siblings', ->
    it 'should provide all siblings in document order, except for the current node', ->
      expect(ids n23.siblings()).toHavePropertiesWithValues([4, 5, 7, 8])
