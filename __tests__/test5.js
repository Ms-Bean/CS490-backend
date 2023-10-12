require("../__tests__2/test3.js")
let server_url="http://localhost:3500/";
test_cases = [
    {
        headers: {
            "customer_id": 5,
        },
        test_case_data: {
            "expected_value":0
        }
    },
    {
        headers: {
        },
        test_case_data: {
            "expected_value":1
        }
    }
];
test_cases.forEach((test_case) => {
    test('get customer rentals', async () => {
        let response = await fetch(server_url + "get_customer_rentals/",{
            method: "GET",
            mode: "cors",
            headers: test_case.headers
        })
        let data = await response.text();

        expect(JSON.parse(data).failure).toBe(test_case.test_case_data.expected_value);
    });
});
