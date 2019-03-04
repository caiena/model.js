import _     from '@caiena/lodash-ext'
import Model from '../../../../src/model'


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
