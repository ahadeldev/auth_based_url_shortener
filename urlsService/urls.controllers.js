import { nanoid } from "nanoid";

import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpstatuscodes.js";
import UrlsServices from "./urls.services.js";

class UrlsControllers {

  // @desc    Create new url
  // @route   POST /api/v1/urls
  // @access  Private
  static async createUrlController(req, res, next){
    const {long_url, description} = req.body;
    const userId = req.user.id;
    if (!long_url) {
      return next(new ApiError("please add url", httpStatusCodes.UNPROCESSABLE_ENTITY, true));
    }

    try {
      const urlId = await UrlsServices.createUrl(long_url, description, userId);
      res.status(httpStatusCodes.RESOURCE_CREATED).json(urlId);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
    }
  }

  // @desc    Get all urls
  // @route   GET /api/v1/urls
  // @access  Private
  static async getAllUrlsController(req, res, next){
    const userId = req.user.id;
    try {
      const urls = await UrlsServices.getAllUrls(userId);
      res.status(httpStatusCodes.OK).json(urls);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
    }
  }

  // @desc    Get url by id
  // @route   GET /api/v1/urls/:id
  // @access  Private
  static async getUrlByIdController(req, res, next){
    const id = req.params.id;
    const userId = req.user.id;
    try {
      const url = await UrlsServices.getUrlById(id, userId);
      res.status(httpStatusCodes.OK).json(url);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
    }
  }

  // @desc    Update url by id
  // @route   PUT /api/v1/urls/:id
  // @access  Private
  static async updateUrlByIdController(req, res, next){
    const id = req.params.id;
    const userId = req.user.id;
    const updatedBody = req.body;
    console.log(id)
    console.log(userId)
    console.log(updatedBody)
    try {
      const updatedUrl = await UrlsServices.updateUrlById(id, userId, updatedBody)
      res.status(httpStatusCodes.OK).json(updatedUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
    }
  }

  // @desc    Delete url by id
  // @route   DELETE /api/v1/urls/:id
  // @access  Private
  static async deleteUrlByIdController(req, res, next){
    const id = req.params.id;
    const userId = req.user.id;
    try {
      const deleted = await UrlsServices.deleteUrlById(id, userId);
      res.status(httpStatusCodes.OK).json(deleted);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
    }
  }

  // @desc    Redirect url 
  // @route   GET /api/v1/urls/r/:slug
  // @access  Private
  static async redirectUrlController(req, res, next){
    const shortUrl = req.params.slug;
    try {
      const url = await UrlsServices.urlRedirect(shortUrl);
      res.status(httpStatusCodes.OK).redirect(url.long_url);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
    }
  }
}

export default UrlsControllers;