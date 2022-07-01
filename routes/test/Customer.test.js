const request = require("supertest");
const app = require("../../app");

const {populateCustomer} = require("../test/seed/seed");

// beforeEach(populateCustomer);

describe('POST /create_account', () => {
    jest.setTimeout(20000)
    it('should create a customer', (done) => {
    
      let accName = "Test Customer";
      let bals = 50000;
      let password = "testpassword"
  
      request(app)
        .post('/api/account/create_account')
        .send({accName,bals, password})
        .expect((res) => {
          expect(res.headers['authorization']).not.toBeNull();
          expect(res.body._id).not.toBeNull();
          expect(res.body.accNo).toBe(accNo);
        })
                .end((err) => {
          if(err) return done(err);
  
          Customer.findOne({accNo}).then((customer) => {
            expect(customer).not.toBeNull();
            expect(customer.password).not.toBe(password);
            done();
          });

        });
    });
  
    // it('should return validation errors if request is invaild', (done) => {
    //   request(app)
    //   .post('/api/account/create_account')
    //   .send({
    //       accName: "asdvsdf",
    //       password: "sd3"
    //     })
    //     .expect(400)
    //     .end(done);
    // });
  
    // it('should not create user if accountNo in use', (done) => {
    //   request(app)
    //   .post('/api/account/create_account')
    //   .send({
    //       accNo: customers[0].accNo,
    //       password: "testpassword"
    //     })
    //     .expect(400)
    //     .end(done);
    // });
  });