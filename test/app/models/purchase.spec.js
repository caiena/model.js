import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import moment   from 'moment'
import Model    from '../../../src/model'

// support models
import Purchase  from '../../support/app/models/purchase'

import User  from '../../support/app/models/user'


describe('Purchase', () => {

  describe('instantiating', () => {
    // it('allows defining the attributes, defining get/set properties on instances', () => {
    //   let user = new User({ name: 'John Doe' })
    //   expect(user.name).to.equal('John Doe')

    //   user.name = 'Jane Doe'
    //   expect(user.name).to.equal('Jane Doe')
    // })

    // it('ignores unknown attributes', () => {
    //   let user = new User({ ignored: true })

    //   expect(user).not.to.have.property('ignored')
    //   expect(user.$has('ignored')).to.be.false
    //   expect(user.toJSON()).not.to.have.property('ignored')
    // })

    // it('handles enums, transforming values in keys', () => {
    //   let user = new User({ name: 'Forkbomb', status: -1 })

    //   expect(user.status).to.equal('failure')
    // })
  })


  describe('relations', () => {
    const $relations = Purchase.$relations

    it('belongs to buyer', () => {
      expect($relations.buyer).to.have.property('type', 'belongsTo')

      let purchase = new Purchase({ buyer: { name: 'Charlie Runkle' } })
      expect(purchase.buyer).to.be.instanceof(User)
      expect(purchase.$get('buyer.name')).to.equal('Charlie Runkle')
    })

    it('belongs to seller', () => {
      expect($relations.seller).to.have.property('type', 'belongsTo')

      let purchase = new Purchase({ seller: { name: 'Hank Moody' } })
      expect(purchase.seller).to.be.instanceof(User)
      expect(purchase.$get('seller.name')).to.equal('Hank Moody')
    })


    it('belongs to auditor', () => {
      expect($relations.auditor).to.have.property('type', 'belongsTo')

      let purchase = new Purchase({ auditor: { name: 'Karen van der Beek ' } })
      expect(purchase.auditor).to.be.instanceof(User)
      // XXX: using include() istead of equal() because Admin overrides name's setter
      expect(purchase.$get('auditor.name')).to.include('Karen van der Beek ')
    })
  })


  describe('attributes', () => {
    // it('allows setting multiple attributes at once', () => {
    //   let user = new User({ name: 'First man' })
    //   user.$attrs = {
    //     id: 1,
    //     status: 'success'
    //   }

    //   expect(user.toJSON()).to.deep.equal({
    //     id: 1,
    //     name: 'First man',
    //     status: 'success'
    //   })

    // })
  })

  describe('validation', () => {
    context('approvedAt', () => {
      it('cannot be after createdAt', async () => {
        let purchase = new Purchase({
          createdAt:  moment.utc().format(),
          approvedAt: moment.utc().subtract(1, 'hour').format()
        })

        expect(await purchase.$validate()).to.be.false
        expect(purchase.$errors).to.have.property('approvedAt')

        purchase.approvedAt = _.sample([
          purchase.createdAt,
          moment.utc(purchase.createdAt).add(1, 'hour')
        ])
        expect(await purchase.$validate()).to.be.true
        expect(purchase.$errors).to.be.empty
      })
    })
  })


  describe('translations', () => {
    context('static i18nScope', () => {
      it('reflects class name: "purchase"', () => {
        expect(Purchase.i18nScope).to.equal('models.purchase')
      })
    })

    context('static $tModelName()', () => {
      it('translates model name', () => {
        expect(Purchase.$tModelName()).to.equal('Pedido')
        expect(Purchase.$tModelName({ count: 0 })).to.equal('Pedido')
      })

      it('translates pluralized model name', () => {
        expect(Purchase.$tModelName({ count: _.sample([2, 3, 5]) })).to.equal('Pedidos')
      })
    })

    context('translations attributes', () => {
      it('translates "id"', () => {
        expect(Purchase.$tAttr('id')).to.equal('ID')
      })

      it('translates "status"', () => {
        expect(Purchase.$tAttr('status')).to.equal('Situação')
      })

      it('translates "createdAt"', () => {
        expect(Purchase.$tAttr('createdAt')).to.equal('Recebido em')
      })
    })

    context('translations enums', () => {
      it('translates with enum name only', () => {
        expect(Purchase.$tEnum('status')).to.equal('Situação')
      })

      it('translates with enum name and value', () => {
        expect(Purchase.$tEnum('status', 'shipped')).to.equal('Enviado')
      })
    })
  })

})
