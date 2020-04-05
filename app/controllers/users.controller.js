'use strict';

const _ = require('lodash');
const Controller = require('./abstract.controller');
const Joi = require('@hapi/joi');
const { User } = require('../models');

class UsersController extends Controller {
  /**
   * api handler for signup
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async signup(req, res) {
    const designerReqSchema = Joi.object({
      registerAs: Joi.string().valid('designer').required(),
      email: Joi.string().email(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      capacity: Joi.number().min(1).max(10).required(),
      material: Joi.string().valid('designer')
        .valid('Wood', 'Metal', 'Glass', 'Plastic', 'Concrete', 'Other')
        .required(),
      location: Joi.string().required()
    });

    const makerReqSchema = Joi.object({
      registerAs: Joi.string().valid('maker').required(),
      email: Joi.string().email(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      capacity: Joi.number().min(1).max(10).required(),
      material: Joi.string().valid('designer')
        .valid('Furniture Designer', 'Architect', 'Interior Designer', 'Industrial Designer', 'Designer Maker', 'Other')
        .required(),
      location: Joi.string().required()
    });

    try {
      const { registerAs } = req.body;
      // Validation
      if (registerAs === 'designer') {
        await designerReqSchema.validateAsync(req.body);
      } else if (registerAs === 'maker') {
        await makerReqSchema.validateAsync(req.body);
      } else {
        throw new Error('Invalid registerAs parameter');
      }

      const existingUser = await User.findOne({
        email: req.body.email
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = new User(req.body);
      await user.save();
      const userObj = user.toJSON();
      delete userObj.password;
      res.success(userObj);
    } catch (err) {
      console.log(err);
      res.error(err);
    }

  }
}

module.exports = () => new UsersController('user');
