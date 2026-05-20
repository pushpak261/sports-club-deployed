// import React from "react";
//
// import '../../style/pagination.css';
//
// const Pagination = ({currentPage, totalPages, onPageChange}) => {
//
//     const pageNumbers = [];
//     for(let i = 1; i <= totalPages; i++){
//         pageNumbers.push(i);
//     }
//
//     return(
//         <div className="pagination">
//             {pageNumbers.map((number)=>(
//                 <button
//                     key={number}
//                     onClick={() => onPageChange(number)}
//                     className={number === currentPage ? 'active' : ''}
//                 >
//                     {number}
//
//                 </button>
//             ))}
//         </div>
//     )
// }
// export default Pagination;




// Hiding some Pagination buttons to make user friendly

import React from "react";
import '../../style/pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];


    const maxPageButtons = 5;
    const half = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);


    if (endPage - startPage < maxPageButtons - 1) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        } else {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
    }


    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)}>1</button>
                    {startPage > 2 && <span className="ellipsis">...</span>}
                </>
            )}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={number === currentPage ? 'active' : ''}
                >
                    {number}
                </button>
            ))}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="ellipsis">...</span>}
                    <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                </>
            )}
        </div>
    );
};

export default Pagination;

