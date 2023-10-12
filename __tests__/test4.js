require("../__tests__2/test3.js")
let server_url="http://localhost:3500/";
test_cases = [
    {
        headers: {
            "customer_first_name": "KRELL",
            "customer_last_name": "MOSET"
        },
        test_case_data: {
            "expected_value":0
        }
    },
    {
        headers: {
            "customer_first_name": "KREL35463'SELECT * FROM staff;",
            "customer_last_name": "MOSET"
        },
        test_case_data: {
            "expected_value":1
        }
    },
    {
        headers: {
            "customer_id": "asdf"
        },
        test_case_data: {
            "expected_value":1
        }
    },
    {
        headers: {
            "customer_first_name": "KRELL",
            "customer_last_name": "MOS' OR 1=1; --"
        },
        test_case_data: {
            "expected_value":1
        }
    }
];
var krell_id;
test_cases.forEach((test_case) => {
    test('get customer list test', async () => {
        let response = await fetch(server_url + "get_customer_list/",{
            method: "GET",
            mode: "cors",
            headers: test_case.headers
        })
        let data = await response.text();

        /*delete krell moset from the previous test*/
        if(test_case.test_case_data.expected_value == 0)
        {
            let response_2 = await fetch(server_url + "delete_customer/",{
                method: "POST",
                mode: "cors",
                headers: {
                    customer_id: JSON.parse(data).result_table[0].customer_id
                }
            })
            let data_2 = await response_2.text();
            expect(JSON.parse(data_2).failure).toBe(0);
        }
        expect(JSON.parse(data).failure).toBe(test_case.test_case_data.expected_value);
    });
});