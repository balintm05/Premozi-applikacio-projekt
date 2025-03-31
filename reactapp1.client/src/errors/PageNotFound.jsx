import ThemeWrapper from "../layout/ThemeWrapper";

function PageNotFound() {
    return (
        <ThemeWrapper className="container text-center" as="div">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <ThemeWrapper className="card my-5" as="div">
                        <h2>A keresett oldal nem található</h2>
                    </ThemeWrapper>
                </div>
            </div>
        </ThemeWrapper>
    );
}

export default PageNotFound;