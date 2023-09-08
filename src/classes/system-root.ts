// Layouts
import { SystemUser } from "../layouts/system";


export class SystemRoot implements SystemUser {
    // The root's UUID.
    public static UUID = "00000000-0000-0000-0000-000000000000";

    readonly id: string = SystemRoot.UUID;

    readonly ns: string = 'system';

    readonly scopes: string[] | null = null;
}
