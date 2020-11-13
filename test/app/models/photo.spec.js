import _        from '@caiena/lodash-ext'
import moment   from 'moment'


// support models
import User      from '../../support/app/models/user'
import Photo     from '../../support/app/models/photo'
import { expect } from 'chai'


describe('Photo', () => {

  describe('relations', () => {
    const $relations = Photo.$relations

    it('belongs to user', () => {
      expect($relations.user).to.have.property('type', 'belongsTo')

      let photo = new Photo({ user: { name: 'Charlie Runkle' } })
      expect(photo.user).to.be.instanceof(User)
      expect(photo.$get('user.name')).to.equal('Charlie Runkle')
    })
  })


  describe('validation', () => {
    const $constraints = Photo.$constraints

    context('filename', () => {
      it('validates its presence', async () => {
        expect($constraints.filename).to.have.property('presence', true)

        let photo = new Photo({ filename: null, size: 10 })
        expect(await photo.$validate()).to.be.false
        expect(photo.$errors).to.have.property('filename')
        expect(photo.$errors.filename[0]).to.have.property('code', 'presence')
        expect(photo.$errors.filename).to.containSubset([{
          message: "não pode ficar em branco"
        }])

        photo.filename = 'JohnWick.png'
        expect(await photo.$validate()).to.be.true
        expect(photo.$errors).to.be.empty
      })
    })

    context('filename', () => {
      describe('numericality', () => {
        it('must be a number', async () => {
          expect(_.present($constraints.size.numericality)).to.be.true
  
          let photo = new Photo({ filename: 'JohnWick.png', size: 'not a number' })
          expect(await photo.$validate()).to.be.false
          expect(photo.$errors).to.have.property('size')
          expect(photo.$errors.size[0]).to.have.property('code', 'numericality')
          expect(photo.$errors.size).to.containSubset([{
            message: "não é um número válido"
          }])
  
          photo.size = 1
          expect(await photo.$validate()).to.be.true
          expect(photo.$errors).to.be.empty
        })

        it('must be an integer', async () => {
          expect($constraints.size.numericality).to.have.property('onlyInteger', true)
  
          let photo = new Photo({ filename: 'JohnWick.png', size: 1.2 })
          expect(await photo.$validate()).to.be.false
          expect(photo.$errors).to.have.property('size')
          expect(photo.$errors.size[0]).to.have.property('code', 'numericality')
          expect(photo.$errors.size).to.containSubset([{
            message: "deve ser um número inteiro"
          }])
  
          photo.size = 1
          expect(await photo.$validate()).to.be.true
          expect(photo.$errors).to.be.empty
        })

        it('must greater than 0', async () => {
          expect($constraints.size.numericality).to.have.property('greaterThan', 0)
  
          let photo = new Photo({ filename: 'JohnWick.png', size: -1 })
          expect(await photo.$validate()).to.be.false
          expect(photo.$errors).to.have.property('size')
          expect(photo.$errors.size[0]).to.have.property('code', 'numericality')
          expect(photo.$errors.size).to.containSubset([{
            message: "deve ser maior que 0"
          }])
  
          photo.size = 1
          expect(await photo.$validate()).to.be.true
          expect(photo.$errors).to.be.empty
        })
      })
    })
  })


  describe('translations', () => {
    context('static i18nScope', () => {
      it('reflects class name: "photo"', () => {
        expect(Photo.i18nScope).to.equal('models.photo')
      })
    })

    context('static $tModelName()', () => {
      it('translates model name', () => {
        expect(Photo.$tModelName()).to.equal('Foto')
        expect(Photo.$tModelName({ count: 0 })).to.equal('Foto')
      })

      it('translates pluralized model name', () => {
        expect(Photo.$tModelName({ count: _.sample([2, 3, 5]) })).to.equal('Fotos')
      })
    })

    context('translations attributes', () => {
      it('translates "id"', () => {
        expect(Photo.$tAttr('id')).to.equal('ID')
      })

      it('translates "filename"', () => {
        expect(Photo.$tAttr('filename')).to.equal('Nome do arquivo')
      })

      it('translates "mimetype"', () => {
        expect(Photo.$tAttr('mimetype')).to.equal('Tipo de arquivo')
      })

      it('translates "size"', () => {
        expect(Photo.$tAttr('size')).to.equal('Tamanho')
      })
    })
  })

})
