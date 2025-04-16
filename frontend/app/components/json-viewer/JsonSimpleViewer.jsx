import React from "react";

function JSONDisplay({json}) {
    return (
        <pre>
            <code>{JSON.stringify(json, null, 2)}</code>
        </pre>
    )
}

export default JSONDisplay;