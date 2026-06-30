import { render, screen } from "@testing-library/react";
import { CookiesProvider } from "react-cookie";
import BugApiTable from "./BugApiTable";

describe("BugApiTable", () => {
    const mockColumns = [
        {
            title: "Name",
            field: "name",
            sortable: true,
        },
        {
            title: "Status",
            field: "status",
            sortable: false,
        },
    ];

    const mockData = {
        status: "success",
        data: [
            { id: 1, name: "Item 1", status: "Active" },
            { id: 2, name: "Item 2", status: "Inactive" },
            { id: 3, name: "Item 3", status: "Active" },
        ],
    };

    const renderComponent = (props = {}) => {
        const defaultProps = {
            apiUrl: "/api/test",
            columns: mockColumns,
            mockApiData: mockData,
            ...props,
        };

        return render(
            <CookiesProvider>
                <BugApiTable {...defaultProps} />
            </CookiesProvider>
        );
    };

    it("renders without crashing", () => {
        renderComponent();
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("displays table headers", () => {
        renderComponent();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("displays table data", () => {
        renderComponent();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("displays all rows from mock data", () => {
        renderComponent();
        const rows = screen.getAllByRole("row");
        // +1 for header row
        expect(rows).toHaveLength(mockData.data.length + 1);
    });

    it("renders no data message when data is empty", () => {
        renderComponent({
            mockApiData: {
                status: "success",
                data: [],
            },
            noData: "No items found",
        });
        expect(screen.getByText("No items found")).toBeInTheDocument();
    });
});
