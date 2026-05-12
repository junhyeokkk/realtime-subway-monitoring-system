import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from 'src/common/responses/success.response';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: '서버 상태 확인' })
    check() {
        return successResponse({
            status: 'UP',
            serverTime: new Date().toISOString(),
        },
        '서버 동작 체크'
    );
    }
}