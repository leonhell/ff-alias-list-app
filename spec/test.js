var assert = require("chai").assert
var nodeListTransform = require("../www/js/nodeListTransform.js")

describe("Wifi Analyzer alias list", function () {
	it("should list a simple node", function () {
		var result = nodeListTransform({
			nodes: {
				c423523487: {
					nodeinfo: {
						hostname: "host-one",
						network: {
							mesh: {
								bat0: {
									interfaces: {
										wireless: ["99:ee:ee:ee:01:01"]
									}
								}
							}
						}
					}
				}
			}
		});
		assert.include(result, "99:ee:ee:ee:01:01|host-one");
	});

	it("should filter out nodes without hostname", function () {
		var result = nodeListTransform({
			nodes: {
				c423523487: {
					nodeinfo: {
						network: {
							mesh: {
								bat0: {
									interfaces: {
										wireless: ["99:ee:ee:ee:01:01"]
									}
								}
							}
						}
					}
				}
			}
		});
		assert.notInclude(result.join(), "undefined");
	});

	it("should filter out nodes without interfaces", function () {
		var result = nodeListTransform({
			nodes: {
				c423523487: {
					nodeinfo: {
						hostname: "host-one",
						network: {
							mesh: {
								bat0: {}
							}
						}
					}
				}
			}
		});

		assert.notInclude(result.join(), "undefined");
	});

	it("should list a node with multiple macs", function () {
		var result = nodeListTransform({
			nodes: {
				c423523487: {
					nodeinfo: {
						hostname: "host-one",
						network: {
							mesh: {
								bat0: {
									interfaces: {
										wireless: [
											"99:ee:ee:ee:01:01",
											"11:ee:ee:ee:01:01"
										]
									}
								}
							}
						}
					}
				}
			}
		});

		assert.include(result, "99:ee:ee:ee:01:01|host-one");
		assert.include(result, "11:ee:ee:ee:01:01|host-one");
	});

	it("should add the next and previous mac", function () {
		var result = nodeListTransform({
			nodes: {
				c423523487: {
					nodeinfo: {
						hostname: "host-one",
						network: {
							mesh: {
								bat0: {
									interfaces: {
										wireless: ["99:ee:ee:ee:01:01"]
									}
								}
							}
						}
					}
				}
			}
		});

		assert.include(result, "99:ee:ee:ee:01:01|host-one");
		assert.include(result, "99:ef:ee:ee:01:01|host-one");
		assert.include(result, "99:ed:ee:ee:01:01|host-one");
	});
});