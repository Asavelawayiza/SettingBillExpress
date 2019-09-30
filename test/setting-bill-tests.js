const assert = require("assert");
const settingsBill = require("../settings-bill-express.js");

describe("Settings Bill Express tests", function() {
  it("should return the correct cost set in the settings", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 2,
      warningLevel: 20,
      criticalLevel: 40
    });

    assert.deepEqual(instance.displaySettings(), {
      smsCost: 2,
      callCost: 2,
      warningLevel: 20,
      criticalLevel: 40
    });
  });

  it("Record sms when an sms is made", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 2,
      warningLevel: 20,
      criticalLevel: 40
    });
    instance.bill("sms");
    assert.deepEqual(instance.displayActions(), [
      { type: "sms", cost: 2, timestamp: new Date() }
    ]);
  });

  it("Record call when an call is made", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 2,
      warningLevel: 10,
      criticalLevel: 20
    });
    instance.bill("call");
    assert.deepEqual(instance.displayActions(), [
      { type: "call", cost: 2, timestamp: new Date() }
    ]);
  });

  it("Record both sms and call ", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 2,
      warningLevel: 10,
      criticalLevel: 20
    });
    instance.bill("call");
    instance.bill("sms");
    assert.deepEqual(instance.displayActions(), [
      { type: "call", cost: 2, timestamp: new Date() },
      { type: "sms", cost: 2, timestamp: new Date() }
    ]);
  });



  it("should return the cost if 5x sms @R2.00 are made and 5x calls @R2.00", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 2,
      warningLevel: 20,
      criticalLevel: 40
    });
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("call");
    instance.bill("call");

  
    assert.deepEqual(instance.totals(), {
      smsTotal: 8,
      callTotal: 14,
      grandTotal: 22
    });
  });

  it("should return the correct cost set in the settings", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 2,
      warningLevel: 20,
      criticalLevel: 40
    });
    instance.bill("sms");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    
    assert.deepEqual(instance.totals(), {
      smsTotal: 10,
      callTotal: 8,
      grandTotal: 18
    });
  });
});

