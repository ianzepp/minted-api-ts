import { HttpRouter } from '../classes/http-router';

// Tests
describe('PingRouter', () => {
    let router: HttpRouter;

    beforeEach(() => {
        router = new HttpRouter();
    });

    test('should correctly return name', () => {
        expect(router.toName()).toBe('<unknown>');
    });
});
