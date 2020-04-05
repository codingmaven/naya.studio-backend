'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

class ControllerAbstract {
  /**
   * Constructor
   * @param modelName - model name
   * @param joiSchema - joi schema for validation
   */
  constructor(modelName, joiSchema) {
    this.model = mongoose.model(modelName);
    this.name = modelName;
    this.joiSchema = joiSchema;
  }

  /**
   * list all api
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async listAll(req, res) {
    const entities = await this.model.find({});
    res.success({ data: { docs: entities } });
  }

  /**
   * list api
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async list(req, res) {
    const entities = await this.model.paginate({}, { offset: req.offset, limit: req.limit, select: '-__v' });
    res.success({ data: entities });
  }

  /**
   * show api
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async show(req, res) {
    const { id } = req.params;
    const entity = await this.model.findById(id).select('-__v');
    res.success({ data: entity });
  }

  /**
   * create api
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async create(req, res) {
    const request = req.body;

    // validate input data
    if (this.joiSchema) {
      const validationResult = this.joiSchema.validate(request, { abortEarly: false, allowUnknown: true });
      if (validationResult.error) {
        return res.error(validationResult.error.details);
      }
    }

    const entity = new this.model(request);
    await entity.save();
    res.success({ data: entity });
  }

  /**
   * update api
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async update(req, res) {
    const { id } = req.params;
    const request = req.body;
    const entity = await this.model.findById(id);
    _.assign(entity, request);

    if (_.get(req, 'user.sub')) {
      entity.updated_by = _.get(req, 'user.sub');
    }

    await entity.save();
    res.success({ data: entity });
  }

  /**
   * destroy api
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async destroy(req, res) {
    const { id } = req.params;
    const entity = await this.model.findById(id);
    await entity.remove();
    res.success();
  }
}

module.exports = ControllerAbstract;