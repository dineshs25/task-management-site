import React from 'react';
import { render } from '@testing-library/react';
import Login from '../components/login';
import { BrowserRouter } from 'react-router-dom';

const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...(jest.requireActual("react-router-dom")),
    useNavigate: () => mockedUseNavigate
}));

describe("App", () => {
    it("renders correctly", async () => {
        render(<BrowserRouter>
            <Login />
        </BrowserRouter>);
    });
});
