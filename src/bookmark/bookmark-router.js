const express = require('express')
const xss = require('xss')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { bookmarks } = require('../store')
const BookmarksService = require('../bookmarks-service')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: bookmark.title,
    url: xss(bookmark.url),
    description: xss(bookmark.description),
    rating: bookmark.rating,
})

bookmarkRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => 
                res.json(bookmarks.map(serializeBookmark)))
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { title, url, description, rating } = req.body;

        const bookmark = {
            title,
            url,
            description,
            rating
        };

        for (const [key, value] of Object.entries(bookmark)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key} in request body`}
                })
            }
        }

        if (isNaN(Number(bookmark.rating)) || Number(bookmark.rating) > 5 || Number(bookmark.rating) < 1 ) {
            return res.status(400).json({
                error: {message: `rating should be a number between 1 and 5`}
            })
        }

        BookmarksService.insertBookmark(
            req.app.get('db'),
            bookmark
        )
            .then(bookmark => {
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)
        })

bookmarkRouter
    .route('/bookmarks/:id')
    .all((req, res, next) => {
        BookmarksService.getById(
            req.app.get('db'),
            req.params.id
        )
        .then(bookmark => {
            if(!bookmark) {
                return res.status(404).json({
                    error: { message: `Bookmark doesn't exist` }
                })
            }
            res.bookmark = bookmark
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeBookmark(res.bookmark))
    })
    .delete((req, res, next) => {
        BookmarksService.deleteBookmark(
            req.app.get('db'),
            req.params.id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    
    module.exports = bookmarkRouter