let server_url="http://localhost:3500/";
test_cases = [
    {
        headers: {
            "store_id":"1",
            "first_name":"KRELL",
            "last_name":"MOSET",
            "email":"krellmoset@njit.edu",
            "address_id":4
        },
        test_case_data: {
            "expected_value":0
        }
    },
    {
        headers: {
            "store_id":"1",
            "first_name":"KRELL",
            "last_name":"MOSET",
            "email":"'or 1=1",
            "address_id":4
        },
        test_case_data: {
            "expected_value":1
        }
    },
    {
        headers: {
            "store_id":"1",
            "first_name":"KRELL",
            "last_name":"MOSET'or1=1",
            "email":"krellmoset@njit.edu",
            "address_id":4
        },
        test_case_data: {
            "expected_value":1
        }
    },
    {
        headers: {
            "store_id":"sdfgsdg",
            "first_name":"KRELL",
            "last_name":"MOSET",
            "email":"krellmoset@njit.edu",
            "address_id":4
        },
        test_case_data: {
            "expected_value":1
        }
    }
];
test_cases.forEach((test_case) => {
    test('add customer test', async () => {
        let response = await fetch(server_url + "add_customer/",{
            method: "POST",
            mode: "cors",
            headers: test_case.headers
        })
        let data = await response.text();
        expect(JSON.parse(data).failure).toBe(test_case.test_case_data.expected_value);
    });
});