import _        from '@caiena/lodash-ext'
import moment   from 'moment'

// support models
import Admin        from '../../support/app/models/admin'


describe('Admin', () => {

  describe('instantiating', () => {
    // TODO
  })


  describe('relations', () => {
    const $relations = Admin.$relations

    it('has many auditingPurchases', () => {
      expect($relations.auditingPurchases).to.have.property('type', 'hasMany')

      let yesterday = moment.utc().subtract(1, 'day').format('YYYY-MM-DD')
      let admin = new Admin({ auditingPurchases: [{ id: 11, createdAt: yesterday }] })

      expect(admin.auditingPurchases[0]).to.be.instanceof($models.Purchase)
      expect(admin.$get('auditingPurchases[0].id')).to.equal(11)
      expect(admin.$get('auditingPurchases[0].createdAt')).to.equal(yesterday)
    })

    it('belongs to createdBy (Admin)', () => {
      expect($relations.createdBy).to.have.property('type', 'belongsTo')

      let admin = new Admin({ createdBy: { id: 11 } })
      expect(admin.createdBy).to.be.instanceof(Admin)
      expect(admin.$get('createdBy.id')).to.equal(11)
    })
  })

  describe('attributes', () => {
    // TODO
    const $attrs = Admin.$attrs
  })

  describe('validation', () => {
    // TODO
  })

  describe('translations', () => {
    context('static i18nScope', () => {
      it('reflects class name: "admin"', () => {
        expect(Admin.i18nScope).to.equal('models.admin')
      })
    })

    context('static $tModelName()', () => {
      it('translates model name', () => {
        expect(Admin.$tModelName()).to.equal('Administrador')
        expect(Admin.$tModelName({ count: 0 })).to.equal('Administrador')
      })

      it('translates pluralized model name', () => {
        expect(Admin.$tModelName({ count: _.sample([2, 3, 5]) })).to.equal('Administradores')
      })
    })

    context('translations attributes', () => {
      it('translates "id"', () => {
        expect(Admin.$tAttr('id')).to.equal('ID')
      })

      it('translates "status"', () => {
        expect(Admin.$tAttr('status')).to.equal('Situação')
      })
    })

    context('translations enums', () => {
      it('translates with enum name only', () => {
        expect(Admin.$tEnum('status')).to.equal('Situação')
      })

      it('translates with enum name and value', () => {
        expect(Admin.$tEnum('status', 'failure')).to.equal('Falha')
      })
    })
  })

})
