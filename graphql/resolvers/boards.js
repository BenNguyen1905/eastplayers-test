const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError, UserInputError, FilterRootFields } = require('apollo-server');
const Board = require('../../models/Board');

module.exports = {
    getPostsByBoard: (board, {}) => Post.find({ boardId: board.id }),
    Query: {
        async getBoards () {
            try{
                const boards = await Board.find().sort({ createdAt: -1});
                return boards;
            } catch (err){
                throw new Error(err);
            }
        },
        async getBoard (_, { boardId }) {
            try{
                const board = await Board.findById(boardId);
                if (!!board) {
                    return board;
                } else {
                    throw new Error('board not found');
                }
            } catch (err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createBoard(_,{ title }, context){
            const user = checkAuth(context);
            const newBoard = new Board ({
                title,
                userId: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const board = await newBoard.save();

            return board;
        },
        async deleteBoard(_, { boardId }, context) {
            const user = checkAuth(context);
            try {
              const board = await Board.findById(boardId);
              await board.delete();
              if (user.username === board.username) {
                await board.delete();
                return 'Board deleted successfully';
              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } catch (err) {
              throw new Error(err);
            }
        },
        async updateBoard(_, {boardId, title}, context) {
            try {
                const user = await checkAuth(context);
                const board = await Board.findById(boardId);
                const updateBoard = new Board({
                    _id: board.id,
                    title
                })
                await board.updateOne(updateBoard);
                await board.save();
                const updatedBoard = await Board.findById(boardId);
                return updatedBoard;
            } catch (err) {
                throw new Error(err);
            }
        },
    }
}