import _     from '@caiena/lodash-ext'
import Model from '../../../../src/model'

import Admin from './admin'


class Purchase extends Model {
  static get attrs() {
    return ['id', 'status', 'createdAt', 'approvedAt', 'shippedAt', 'deliveredAt']
  }

  static get virtuals() {
    return ['delivered', 'shipped']
  }

  static get enums() {
    return {
      status: { received: 1, approved: 2, shipped: 3, delivered: 4 }
    }
  }

  static get relations() {
    return {
      buyer: {
        type: 'belongsTo',
        model() {
          // XXX: we're providing a custom lazily evaluated function to return model class.
          // Since we're using mocha+babel, we will rely on their tooling to perform the lazy
          // evaluation.
          // Use your own app tooling to achieve the same result (e.g. method, global variable
          // already initialized, ...)
          const User = require('./user').default

          return User
        }
      },

      seller: {
        type: 'belongsTo',
        model: 'User' // falling back to default $lookup, since we provided the global $models in test/support/app/boot.js
      },

      auditor: {
        type: 'belongsTo',
        model: Admin // here we're providing the class instantly. Use it with caution, avoiding circular dependencies.
      }
    }
  }

  static get constraints() {
    return {
      status: {
        inclusion: this.$enums.status.keys
      },
      approvedAt(value, attrs, attrName, options, constraints) {
        // NOTE: attrs is the model instance! You can call methods too.
        return {
          datetime: {
            earliest: attrs.createdAt
          }
        }
      }
    }
  }

  get approved() {
    return this.$present('approvedAt')
  }

  get shipped() {
    return _.present(this.shippedAt)
  }

  get delivered() {
    return _.present(this.deliveredAt)
  }
}


export default Purchase
