import React from 'react';
import { Card, CardBody, Table, Button } from 'reactstrap';

const AppoinmentToday = ({dataset}) => {
    return (
        <Card>
            <CardBody className="pb-0">
                {/* <Button className="float-right" size={'sm'} color="primary">
                    <i className='uil uil-export ml-1'></i> Export
                </Button> */}

                <h5 className="card-title mt-0 mb-0 header-title">Latest five <b>(5)</b> Requested Loans</h5>

                <Table hover responsive className="mt-4">
                    <thead>
                        <tr>
                            {/* <th scope="col">#</th> */}
                            <th scope="col">Full Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Loan Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Loan Condition</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Entry By</th>
                        </tr>
                    </thead>
                    <tbody>
                        { dataset.map((f, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td>{f.FullName}</td>
                                        <td>{f.Phone}</td>
                                        <td>{f["LoansLoanType.Name"]}</td>
                                        <td>{f.LoansAmount}</td>
                                        <td>{f["LoansLoanCondition.Name"]}</td>
                                        <td><span className={`badge badge-soft-${f["LoansPriority.Code"]==1?"success":f["LoansPriority.Code"]==2?"danger":"warning"} py-1`}>{f["LoansPriority.Name"]}</span></td>
                                        <td>{f['UserUserDetail.FirstName']+" "+f["UserUserDetail.LastName"]}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default AppoinmentToday;
