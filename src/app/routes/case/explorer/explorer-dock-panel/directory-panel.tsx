import * as React               from "react";

import { getFstChildren,
         getSortedChildren,
         FstRoot,
         FstDirectory }         from "app/models";
import { FixedTable }           from "app/components";


interface DirectoryPanel {
    item: FstDirectory;
    fstRoot: FstRoot;
}


export const DirectoryPanel = (props: DirectoryPanel): JSX.Element => {
    const { item, fstRoot } = props;
    const children = getFstChildren(fstRoot, item);

    return (
        <div className="directory-panel">
        <FixedTable.Table columnWidths={[null, null]} >
            <FixedTable.Header>
                <FixedTable.Cell>Name</FixedTable.Cell>
                <FixedTable.Cell>Type</FixedTable.Cell>
            </FixedTable.Header>
            <FixedTable.Body>
                { getSortedChildren(children).map((fileName, i) =>
                    <FixedTable.Row key={i} clickable={true}
                                    onClick={() => this.props.actions.activateFile(item.children[fileName].path)}>
                        <FixedTable.Cell>{item.children[fileName].name}</FixedTable.Cell>
                        <FixedTable.Cell>{item.children[fileName].type}</FixedTable.Cell>
                    </FixedTable.Row>
                )}
            </FixedTable.Body>
        </FixedTable.Table>
    </div>
    );
};